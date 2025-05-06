import { CoreMessage, tool, generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { z } from "zod";
import { Dish, getDishes } from "../db/dishes";
import { getRestaurantInfo } from "../db/restaurant";

const openai = createOpenAI({
  apiKey: import.meta.env.VITE_AI_APIKEY,
});

export const createMessage = async (messages: CoreMessage[]) => {
  const options = {
    model: openai("gpt-4o-mini"),
    system:
      "Eres un bot que ayuda a la gente con sus preguntas sobre un restaurante llamado Nibble. Puedes darles sugerencias, hacer reservaciones, etc.",
    messages,
    tools: {
      sugerencia: tool({
        description:
          "Dar una sugerencia de que pedir en base a todos los platillos del restaurante.",
        parameters: z.object({
          category: z
            .ostring()
            .describe(
              "Es el tipo de platillo que se desea tener una sugerencia. Por ejemplo, hamburguesas, sushis, sopas, ensaladas, etc."
            ),
        }),
        execute: async ({ category }) => {
          const dishes = await getDishes();
          if (category) {
            const categoryCapitalize =
              category.charAt(0).toUpperCase() + category.slice(1);
            return {
              platillos: dishes.get(categoryCapitalize),
            };
          } else {
            let allDishes: Dish[] = [];
            for (const d of dishes.values()) {
              for (const dish of d) {
                allDishes.push(dish);
              }
            }
            return {
              platillos: allDishes,
            };
          }
        },
      }),
      informacion: tool({
        description:
          "Dar información sobre el restaurante. Puede ser la ubicación, la historia, etc.",
        parameters: z.object({
          type: z
            .object({
              category: z
                .ostring()
                .describe(
                  "Es el tipo de información que se quiere saber, por ejemplo ubicacion, historia, dueño, entre otros, decide tu de que trata."
                ),
              hasCategory: z
                .boolean()
                .describe(
                  "Indica true o false si hay una categoria de informacion."
                ),
            })
            .describe(
              "Es un objeto que contiene el tipo de información que se quiere saber. Indica true o false si hay una categoria de informacion."
            ),
        }),
        execute: async ({ type }) => {
          const info = await getRestaurantInfo();
          return { info, type };
        },
      }),
    },
  };
  const result = await generateText(options);
  return result.text;
};
