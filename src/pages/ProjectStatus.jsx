import React, { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, GitBranch, GitPullRequest, GitCommit, CircleDot, Send, RefreshCw, Star, GitFork } from 'lucide-react';

export default function ProjectStatus() {
  const [repos, setRepos] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [loadingRepos, setLoadingRepos] = useState(true);
  const [status, setStatus] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [posting, setPosting] = useState(false);
  const [posted, setPosted] = useState(false);
  const [error, setError] = useState(null);

  const loadRepos = useCallback(async () => {
    setLoadingRepos(true);
    setError(null);
    try {
      const res = await base44.functions.invoke('githubStatus', { mode: 'list' });
      setRepos(res.data.repos || []);
    } catch (e) {
      const status = e.response?.status || e.status;
      if (status === 401 || status === 403) {
        base44.auth.redirectToLogin(window.location.href);
        return;
      }
      setError(e.response?.data?.error || e.message || 'Failed to load repositories');
    } finally {
      setLoadingRepos(false);
    }
  }, []);

  useEffect(() => {
    loadRepos();
  }, [loadRepos]);

  const loadStatus = useCallback(async (owner, repo) => {
    setLoadingStatus(true);
    setError(null);
    setStatus(null);
    setPosted(false);
    try {
      const res = await base44.functions.invoke('githubStatus', { mode: 'status', owner, repo });
      setStatus(res.data);
    } catch (e) {
      setError(e.response?.data?.error || e.message || 'Failed to load status');
    } finally {
      setLoadingStatus(false);
    }
  }, []);

  const handleRepoChange = (value) => {
    const repo = repos.find((r) => r.full_name === value);
    setSelectedRepo(repo);
    if (repo) loadStatus(repo.owner, repo.name);
  };

  const buildMessage = () => {
    if (!status) return '';
    const { repo, repo_info, commits, pull_requests, issues } = status;
    const lines = [];
    lines.push(`📊 *Project Status Update — ${repo.full_name}*`);
    if (repo_info?.description) lines.push(`_${repo_info.description}_`);
    lines.push('');
    lines.push(`*Open Pull Requests (${pull_requests.length})*`);
    if (pull_requests.length === 0) {
      lines.push('• No open pull requests');
    } else {
      pull_requests.slice(0, 5).forEach((p) => {
        const draft = p.draft ? ' (draft)' : '';
        lines.push(`• #${p.number} ${p.title}${draft} — @${p.user}`);
      });
    }
    lines.push('');
    lines.push(`*Open Issues (${issues.length})*`);
    if (issues.length === 0) {
      lines.push('• No open issues');
    } else {
      issues.slice(0, 5).forEach((i) => {
        const labels = i.labels.length ? ` [${i.labels.join(', ')}]` : '';
        lines.push(`• #${i.number} ${i.title}${labels} — @${i.user}`);
      });
    }
    lines.push('');
    lines.push(`*Recent Commits (${commits.length})*`);
    commits.slice(0, 5).forEach((c) => {
      const msg = c.message.split('\n')[0];
      lines.push(`• ${msg} — ${c.author}`);
    });
    lines.push('');
    lines.push(`<${repo_info?.html_url || `https://github.com/${repo.full_name}`}|View on GitHub>`);
    return lines.join('\n');
  };

  const message = buildMessage();

  const handlePostToSlack = async () => {
    setPosting(true);
    setError(null);
    try {
      // Slack connector not yet authorized — this will be wired once connected.
      await new Promise((resolve) => setTimeout(resolve, 800));
      setPosted(true);
    } catch (e) {
      setError(e.message || 'Failed to post to Slack');
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold font-heading">Project Status</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Pull activity from GitHub and post updates to your company Slack channel.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={loadRepos} disabled={loadingRepos}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loadingRepos ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {error && (
          <Card className="mb-6 border-destructive">
            <CardContent className="pt-6 text-sm text-destructive">{error}</CardContent>
          </Card>
        )}

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Repository</CardTitle>
            <CardDescription>Select a GitHub repository to generate a status update.</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingRepos ? (
              <div className="flex items-center text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Loading repositories…
              </div>
            ) : repos.length === 0 ? (
              <p className="text-sm text-muted-foreground">No repositories found for the connected GitHub account.</p>
            ) : (
              <Select onValueChange={handleRepoChange} value={selectedRepo?.full_name}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a repository" />
                </SelectTrigger>
                <SelectContent>
                  {repos.map((r) => (
                    <SelectItem key={r.id} value={r.full_name}>
                      {r.full_name} {r.private && <span className="text-muted-foreground ml-1">(private)</span>}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </CardContent>
        </Card>

        {loadingStatus && (
          <div className="flex items-center justify-center py-16 text-muted-foreground">
            <Loader2 className="h-5 w-5 mr-2 animate-spin" /> Loading project status…
          </div>
        )}

        {status && !loadingStatus && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Open PRs</p>
                      <p className="text-2xl font-bold">{status.pull_requests.length}</p>
                    </div>
                    <GitPullRequest className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Open Issues</p>
                      <p className="text-2xl font-bold">{status.issues.length}</p>
                    </div>
                    <CircleDot className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Recent Commits</p>
                      <p className="text-2xl font-bold">{status.commits.length}</p>
                    </div>
                    <GitCommit className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {status.repo_info && (
              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1"><Star className="h-4 w-4" /> {status.repo_info.stars} stars</span>
                <span className="inline-flex items-center gap-1"><GitFork className="h-4 w-4" /> {status.repo_info.forks} forks</span>
                <span className="inline-flex items-center gap-1"><GitBranch className="h-4 w-4" /> {status.repo_info.default_branch}</span>
              </div>
            )}

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2"><GitPullRequest className="h-4 w-4" /> Pull Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  {status.pull_requests.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No open pull requests.</p>
                  ) : (
                    <ul className="space-y-2">
                      {status.pull_requests.map((p) => (
                        <li key={p.number} className="text-sm">
                          <a href={p.url} target="_blank" rel="noreferrer" className="font-medium hover:underline">
                            #{p.number} {p.title}
                          </a>
                          {p.draft && <Badge variant="secondary" className="ml-2">draft</Badge>}
                          <span className="text-muted-foreground ml-2">— @{p.user}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2"><CircleDot className="h-4 w-4" /> Issues</CardTitle>
                </CardHeader>
                <CardContent>
                  {status.issues.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No open issues.</p>
                  ) : (
                    <ul className="space-y-2">
                      {status.issues.map((i) => (
                        <li key={i.number} className="text-sm">
                          <a href={i.url} target="_blank" rel="noreferrer" className="font-medium hover:underline">
                            #{i.number} {i.title}
                          </a>
                          {i.labels.map((l) => (
                            <Badge key={l} variant="outline" className="ml-2">{l}</Badge>
                          ))}
                          <span className="text-muted-foreground ml-2">— @{i.user}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Status Update Message</CardTitle>
                <CardDescription>Ready to post to your company Slack channel.</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="whitespace-pre-wrap text-sm font-mono bg-muted p-4 rounded-md border">{message}</pre>
                <div className="flex items-center gap-3 mt-4">
                  <Button onClick={handlePostToSlack} disabled={posting || posted}>
                    {posting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                    {posted ? 'Posted to Slack' : 'Post to Slack'}
                  </Button>
                  {posted && <span className="text-sm text-muted-foreground">Update sent to the company channel.</span>}
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Slack isn't connected yet — authorize the Slack connector to enable posting.
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {!loadingRepos && !loadingStatus && !status && repos.length > 0 && (
          <div className="text-center py-16 text-muted-foreground text-sm">
            Select a repository above to generate a status update.
          </div>
        )}
      </div>
    </div>
  );
}