# GitLab cloner

[![NPM](https://nodei.co/npm/gl-cloner.png)](https://nodei.co/npm/gl-cloner/)

Allows to clone full gilab structure to current directory. Also allows to filter downloadable projects.

## How to use:

```bash
npx gl-cloner clone --host https://gitlab.custom.domain --token YOUR_ACCESS_TOKEN --delay 5
```

```
Options:
  --host [host]          GitLab host (default: "https://gitlab.com")
  --token <token>        GitLab access token (you can generate it in your profile)
  --ssh                  Use ssh for cloning (http(s) by default) !!!NOT SUPPORTED YET (default: true)
  --maxPages [maxPages]  Max number of pages to read (default is 2) (default: 2)
  --perPage [perPage]    Page size (max is 100, default is 100) (default: 100)
  --filter [filter]      Filter to get repos (default: "")
  --delay [delay]        Delay between clone calls (default: 0)
  -h, --help             output usage information
```