export class BaseModel {
  id!: string;
  createdAt!: Date;
  updatedAt!: Date;

  toModel(data: Record<string, any>): void {
    this.id = data['id'];
    this.createdAt = new Date(data['created_at']);
    this.updatedAt = new Date(data['updated_at']);
  }
}
