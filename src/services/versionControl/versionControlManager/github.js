import VersionControlManager from './versionControlManager'

class GitHub extends VersionControlManager {
  static #SOURCE_BRANCH = 'main'
  constructor(versionControl, owner, repo) {
    super(versionControl, owner, repo)
  }

  async createBranch(apiKey) {
    if (!apiKey) {
      throw new Error('API key is missing')
    }
    const branchExists = await this.#listBranches()
    if (!branchExists) {
      this.#getBranchAndCreateRef()
    }
  }

  async #getBranchAndCreateRef() {
    try {
      const { data: mainBranch } = await this.versionControl.rest.repos.getBranch({
        owner: this.owner,
        repo: this.repo,
        branch: GitHub.#SOURCE_BRANCH,
      })
      await this.versionControl.rest.git.createRef({
        owner: this.owner,
        repo: this.repo,
        ref: `refs/heads/${this.defaultBranch}`,
        sha: mainBranch.commit.sha,
      })
    } catch (error) {
      throw new Error('Error fetching branch:', error)
    }
  }

  async getFile() {
    const { data: file } = await this.versionControl.rest.repos.getContent({
      owner: this.owner,
      repo: this.repo,
      path,
      ref: this.defaultBranch,
    })

    if (!file || !file.content || file.size > 100 * 1024) {
      const { data: blobData } =
        (await versionControl.octokit.rest.git.getBlob({
          owner: versionControl.owner,
          repo: versionControl.repo,
          file_sha: file && file.sha,
        })) || {}
      file.content = blobData ? blobData.content : null
    }
    return file
  }

  async #listBranches() {
    const { data: branches } = await this.versionControl.rest.repos.listBranches({
      owner: versionControl.owner,
      repo: versionControl.repo,
    })

    return branches ? branches.some((branch) => branch.name === branchName) : false
  }
}

export default GitHub
