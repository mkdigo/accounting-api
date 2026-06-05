export class Factory {
  protected static instances: Map<string, any> = new Map();

  protected static make(key: string, Repository: any): any {
    if (!this.instances.has(key)) {
      this.instances.set(key, new Repository());
    }

    return this.instances.get(key);
  }
}
