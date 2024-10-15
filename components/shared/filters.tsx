"use client";

import React from "react";
import { Title } from "./title";
import { FilterCheckbox } from "./filter-checkbox";
import { Input, RangeSlider } from "../ui";
import { CheckboxFiltersGroup } from "./checkbox-filters-group";
import { useFilterIngredients } from "@/hooks/useFilterIngredients";

interface Props {
  className?: string;
}

export const Filters: React.FC<Props> = ({ className }) => {
  const { ingredients, loading, selectedIds, onAddId } = useFilterIngredients();

  const items = ingredients.map((ingredient) => ({
    text: ingredient.name,
    value: String(ingredient.id),
  }));

  return (
    <div className={className}>
      <Title text="Филтрация" size="sm" className="mb-5 font-bold" />

      {/* Верхние чекбоксы */}
      <div className="flex flex-col gap-4">
        <FilterCheckbox name="get" text="Можно собирать" value="1" />
        <FilterCheckbox name="new" text="Новинки" value="2" />
      </div>

      {/* Филтр по цене+ */}
      <div className="mt-5 border-y border-y-neutral-100 py-6 pb-7">
        <p className="font-bold mb-3">Цена от и до:</p>
        <div className="flex gap-3 mb-5">
          <Input
            type="number"
            placeholder="0"
            min={0}
            max={1000}
            defaultValue={0}
          />
          <Input type="number" placeholder="1000" min={100} max={1000} />
        </div>

        <RangeSlider min={0} max={1000} step={10} value={[0, 1000]} />
      </div>

      <CheckboxFiltersGroup
        title="Ингредиенты:"
        name="ingredient"
        className="mt-5"
        limit={6}
        defaultItems={items.slice(0, 6)}
        items={items}
        loading={loading}
        onClickCheckbox={onAddId}
        selectedIds={selectedIds}
      />
    </div>
  );
};
