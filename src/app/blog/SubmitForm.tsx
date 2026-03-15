"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { blogText } from "@/data/text";

const { form } = blogText;

type FormState = {
  title: string;
  schoolType: string;
  nickname: string;
  content: string;
  email: string;
};

const initialState: FormState = {
  title: "",
  schoolType: "",
  nickname: "",
  content: "",
  email: "",
};

export function SubmitForm() {
  const [values, setValues] = useState<FormState>(initialState);
  const [submitted, setSubmitted] = useState(false);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setValues(initialState);
  }

  const inputBase =
    "w-full border-0 rounded-md bg-white " +
    "shadow-[0_2px_8px_0_rgba(0,0,0,0.06)] " +
    "px-4 py-2.5 " +
    "font-[var(--font-body)] text-sm text-[var(--color-primary)] " +
    "placeholder:text-[var(--color-muted)] " +
    "focus:outline-none focus:shadow-[0_4px_16px_0_rgba(0,0,0,0.10)] " +
    "transition-shadow duration-200";

  const labelBase =
    "block font-[var(--font-en)] text-xs font-medium tracking-widest uppercase text-[var(--color-secondary)] mb-2";

  return (
    <div className="bg-white rounded-xl p-8 md:p-12 shadow-[0_2px_8px_0_rgba(0,0,0,0.06)]">
      <p className="font-[var(--font-en)] text-xs font-medium tracking-widest uppercase text-[var(--color-muted)] mb-4">
        {form.eyebrow}
      </p>
      <h2 className="font-[var(--font-display)] text-2xl md:text-3xl font-bold leading-snug text-[var(--color-primary)] mb-8">
        {form.h2}
      </h2>

      {submitted ? (
        <div className="py-12 text-center space-y-4">
          <p className="font-[var(--font-display)] text-2xl font-bold text-[var(--color-secondary)]">
            感謝投稿！
          </p>
          <p className="font-[var(--font-body)] text-base leading-[1.7] text-[var(--color-primary)]/70 max-w-[50ch] mx-auto">
            {form.fields.submitSuccess}
          </p>
          <Button
            variant="ghost"
            onClick={() => setSubmitted(false)}
            className="mt-4"
          >
            再投一篇
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* School Type */}
            <div>
              <label htmlFor="schoolType" className={labelBase}>
                {form.fields.schoolType}
              </label>
              <select
                id="schoolType"
                name="schoolType"
                value={values.schoolType}
                onChange={handleChange}
                required
                className={inputBase}
              >
                <option value="" disabled>
                  請選擇學校類型
                </option>
                {form.fields.schoolOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Nickname */}
            <div>
              <label htmlFor="nickname" className={labelBase}>
                {form.fields.nickname}
              </label>
              <input
                id="nickname"
                name="nickname"
                type="text"
                value={values.nickname}
                onChange={handleChange}
                placeholder={form.fields.nicknamePlaceholder}
                className={inputBase}
              />
            </div>
          </div>

          {/* Story Title */}
          <div>
            <label htmlFor="title" className={labelBase}>
              {form.fields.title}
              <span className="text-[var(--color-accent)] ml-1">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={values.title}
              onChange={handleChange}
              required
              placeholder={form.fields.titlePlaceholder}
              className={inputBase}
            />
          </div>

          {/* Story Content */}
          <div>
            <label htmlFor="content" className={labelBase}>
              {form.fields.content}
              <span className="text-[var(--color-accent)] ml-1">*</span>
            </label>
            <textarea
              id="content"
              name="content"
              value={values.content}
              onChange={handleChange}
              required
              rows={8}
              placeholder={form.fields.contentPlaceholder}
              className={`${inputBase} resize-y min-h-[160px]`}
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className={labelBase}>
              {form.fields.email}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              placeholder={form.fields.emailPlaceholder}
              className={inputBase}
            />
          </div>

          <div className="pt-2">
            <Button type="submit" variant="accent">
              {form.fields.submit}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
