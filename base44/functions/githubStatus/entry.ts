import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const mode = body.mode || 'list';

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('github');
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'base44-app'
    };

    // Mode: list repositories for the connected user
    if (mode === 'list') {
      const res = await fetch('https://api.github.com/user/repos?sort=updated&per_page=100&affiliation=owner,collaborator,organization_member', { headers });
      if (!res.ok) {
        const t = await res.text();
        return Response.json({ error: `GitHub API error: ${res.status}`, details: t }, { status: 502 });
      }
      const repos = await res.json();
      return Response.json({
        repos: repos.map((r) => ({
          id: r.id,
          name: r.name,
          full_name: r.full_name,
          owner: r.owner.login,
          description: r.description,
          private: r.private,
          updated_at: r.updated_at,
          html_url: r.html_url,
          default_branch: r.default_branch
        }))
      });
    }

    // Mode: status for a specific repo
    if (mode === 'status') {
      const owner = body.owner;
      const repo = body.repo;
      if (!owner || !repo) return Response.json({ error: 'owner and repo are required' }, { status: 400 });

      const base = `https://api.github.com/repos/${owner}/${repo}`;

      const [commitsRes, pullsRes, issuesRes, repoRes] = await Promise.all([
        fetch(`${base}/commits?per_page=10`, { headers }),
        fetch(`${base}/pulls?state=open&sort=updated&direction=desc&per_page=10`, { headers }),
        fetch(`${base}/issues?state=open&sort=updated&direction=desc&per_page=10`, { headers }),
        fetch(base, { headers })
      ]);

      const repoInfo = repoRes.ok ? await repoRes.json() : null;

      const commits = commitsRes.ok ? await commitsRes.json() : [];
      const pulls = pullsRes.ok ? await pullsRes.json() : [];
      const allIssues = issuesRes.ok ? await issuesRes.json() : [];
      // Issues endpoint includes PRs — filter them out
      const issues = allIssues.filter((i) => !i.pull_request);

      const status = {
        repo: { owner, name: repo, full_name: `${owner}/${repo}` },
        repo_info: repoInfo ? {
          description: repoInfo.description,
          stars: repoInfo.stargazers_count,
          forks: repoInfo.forks_count,
          open_issues_count: repoInfo.open_issues_count,
          default_branch: repoInfo.default_branch,
          html_url: repoInfo.html_url
        } : null,
        commits: commits.map((c) => ({
          sha: c.sha,
          message: c.commit.message,
          author: c.commit.author ? c.commit.author.name : (c.author ? c.author.login : 'unknown'),
          date: c.commit.author ? c.commit.author.date : null,
          url: c.html_url
        })),
        pull_requests: pulls.map((p) => ({
          number: p.number,
          title: p.title,
          user: p.user ? p.user.login : 'unknown',
          updated_at: p.updated_at,
          draft: p.draft,
          url: p.html_url
        })),
        issues: issues.map((i) => ({
          number: i.number,
          title: i.title,
          user: i.user ? i.user.login : 'unknown',
          updated_at: i.updated_at,
          labels: (i.labels || []).map((l) => l.name),
          url: i.html_url
        }))
      };

      return Response.json(status);
    }

    return Response.json({ error: `Unknown mode: ${mode}` }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});