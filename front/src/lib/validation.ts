import { PREFECTURES } from "@/constants/prefectures";
import {
  MAX_CITY_LENGTH,
  MAX_COMMUTE_MINUTES,
  MAX_NAME_LENGTH,
  MAX_RENT,
  MAX_SALARY,
} from "@/constants/validation";
import { z } from "zod";

const prefectureValues = new Set<string>(PREFECTURES);

function requiredText(label: string, maxLength: number) {
  return z
    .string()
    .trim()
    .min(1, `${label}は必須です`)
    .max(maxLength, `${label}は${maxLength}文字以内で入力してください`);
}

function optionalText(label: string, maxLength: number) {
  return z
    .string()
    .trim()
    .max(maxLength, `${label}は${maxLength}文字以内で入力してください`);
}

function numericText(label: string, maxValue: number, unit: string) {
  return z
    .string()
    .trim()
    .min(1, `${label}は必須です`)
    .regex(/^\d+$/, `${label}は半角数字で入力してください`)
    .transform(Number)
    .refine((value) => Number.isSafeInteger(value), `${label}は整数で入力してください`)
    .refine((value) => value >= 0, `${label}は0${unit}以上で入力してください`)
    .refine(
      (value) => value <= maxValue,
      `${label}は${maxValue.toLocaleString()}${unit}以下で入力してください`,
    );
}

const prefectureSchema = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label}は必須です`)
    .refine((value) => prefectureValues.has(value), `${label}を選択してください`);

export const guestLoginFormSchema = z.object({
  name: z
    .string()
    .trim()
    .max(MAX_NAME_LENGTH, `名前は${MAX_NAME_LENGTH}文字以内で入力してください`),
});

export const workplaceFormSchema = z.object({
  name: requiredText("勤務先", MAX_NAME_LENGTH),
  salary: numericText("給与（手取り）", MAX_SALARY, "円"),
  prefecture: prefectureSchema("勤務地（都道府県）"),
  city: optionalText("勤務地（市区町村）", MAX_CITY_LENGTH),
});

export const residenceFormSchema = z.object({
  name: requiredText("住居名", MAX_NAME_LENGTH),
  rent: numericText("家賃", MAX_RENT, "円"),
  prefecture: prefectureSchema("場所（都道府県）"),
  city: optionalText("場所（市区町村）", MAX_CITY_LENGTH),
});

export const commuteMinutesSchema = numericText("通勤時間", MAX_COMMUTE_MINUTES, "分");

export function getFieldError<T extends z.ZodRawShape>(
  schema: z.ZodObject<T>,
  values: z.input<z.ZodObject<T>>,
  field: keyof T,
) {
  const result = schema.safeParse(values);

  if (result.success) {
    return null;
  }

  const fieldErrors: Record<string, string[] | undefined> = z.flattenError(result.error).fieldErrors;
  const messages = fieldErrors[field as string];

  return messages?.[0] ?? null;
}

export function getSchemaError(schema: z.ZodType, value: unknown) {
  const result = schema.safeParse(value);

  if (result.success) {
    return null;
  }

  return z.flattenError(result.error).formErrors[0] ?? "入力内容を確認してください";
}
