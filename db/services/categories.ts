// import { request } from "../dbUtils";
import { request } from "../dbUtils";

const TABLE_NAME = "categories"

export type CategoryType = 'income' | 'expense';
export interface Category {
	id: number;
	name: string;
	parent_id: number;
	icon?: string;
	type: CategoryType;
	create_at: string;
	update_at: string;
}

export type CategoryReq = Partial<Category> & { name: string, type: CategoryType };

export const getAllCategories = () => {
	return request.selectAll<Category>(TABLE_NAME)
}
export const getCategory = (id: number) => {
	return request.selectOne<Category>(TABLE_NAME, { field: 'id', value: id })
}
export const createCategory = (category: CategoryReq) => {
	return request.insert(TABLE_NAME, category)
}
export const updateCategory = (category: CategoryReq) => {
	return request.update(TABLE_NAME, category, { field: 'id', value: category.id })
}
export const deleteCategory = (id: number) => {
	return request.delete(TABLE_NAME, { field: 'id', value: id })
}
