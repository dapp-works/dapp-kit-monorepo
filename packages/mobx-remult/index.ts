import { remult, Repository } from "remult";
import { IBaseEntity, EntityType } from "./lib/types";
import { BaseStore } from "./lib/base-store";
import { ListStore } from "./lib/list-store";
import { DetailStore } from "./lib/detail-store";
import { FormStore } from "./lib/form-store";

export class RemultStore<T extends IBaseEntity<T>> extends BaseStore<T> {
  list: ListStore<T>;
  detail: DetailStore<T>;
  form: FormStore<T>;

  static instances = new Map<EntityType<any>, RemultStore<any>>();

  private constructor(repository: Repository<T>, entityType: EntityType<T>) {
    super(repository, entityType);
    this.list = new ListStore<T>(repository);
    this.detail = new DetailStore<T>(repository);
    this.form = new FormStore<T>(repository);
  }

  static Get<T extends IBaseEntity<T>>(entityType: EntityType<T>): RemultStore<T> {
    if (!this.instances.has(entityType)) {
      const repo = remult.repo(entityType);
      // @ts-ignore
      this.instances.set(entityType, new RemultStore<T>(repo, entityType));
    }
    // @ts-ignore
    return this.instances.get(entityType)!;
  }
}
