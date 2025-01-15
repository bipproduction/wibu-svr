interface LockData {
  id: string;
  timestamp: number;
}

class Lock {
    private static _buildLock: LockData | null = null;
    private static _deployLock: LockData | null = null;

    static async setBuildLock(id: string): Promise<void> {
        if (this._buildLock) {
            throw new Error('Build sudah terkunci');
        }
        this._buildLock = {
            id,
            timestamp: Date.now()
        };
    }

    static async setDeployLock(id: string): Promise<void> {
        if (this._deployLock) {
            throw new Error('Deploy sudah terkunci');
        }
        this._deployLock = {
            id,
            timestamp: Date.now()
        };
    }

    static async unlockBuild(): Promise<void> {
        this._buildLock = null;
    }

    static async unlockDeploy(): Promise<void> {
        this._deployLock = null;
    }

    static get isBuildLocked(): boolean {
        return !!this._buildLock;
    }

    static get isDeployLocked(): boolean {
        return !!this._deployLock;
    }

    static getBuildLockInfo(): LockData | null {
        return this._buildLock;
    }

    static getDeployLockInfo(): LockData | null {
        return this._deployLock;
    }
}

export default Lock