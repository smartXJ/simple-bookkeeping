/*
 * @Author: xiaojun
 * @Date: 2025-09-02 20:58:07
 * @LastEditors: xiaojun
 * @LastEditTime: 2025-09-02 21:19:24
 * @Description: 对应操作
 */
import { Category } from "@/db/services/categories";
import { create } from "zustand";

export const useCategoryStore = create<{
  categories: Category[];
  categoryMap: { [key: string]: Category };
  setCategories: (categories: Category[]) => void;
}>((set) => ({
  categories: [],
  categoryMap: {},
  setCategories: (categories: Category[]) =>
    set({
      categories,
      categoryMap: categories.reduce(
        (acc, category) => ({ ...acc, [category.id]: category }),
        {}
      ),
    }),
}));
