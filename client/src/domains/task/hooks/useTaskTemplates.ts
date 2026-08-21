import { useEffect, useState } from "react";
import { getCategories, type Category } from "../categoryService.ts";
import { getRooms, type Room } from "../roomService.ts";

export const useTaskTemplates = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [referenceLoading, setReferenceLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadReferences = async () => {
      try {
        const [roomList, categoryList] = await Promise.all([getRooms(), getCategories()]);

        if (!cancelled) {
          setRooms(roomList);
          setCategories(categoryList);
        }
      } finally {
        if (!cancelled) {
          setReferenceLoading(false);
        }
      }
    };

    loadReferences();

    return () => {
      cancelled = true;
    };
  }, []);

  return { rooms, categories, referenceLoading };
};
