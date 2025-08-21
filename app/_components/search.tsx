"use client";

import { Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "./ui/form";

const formSchema = z.object({
  search: z.string().trim().min(1, "Digite algo para buscar."),
});

type FormValues = z.infer<typeof formSchema>;

const SearchBar = () => {
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { search: "" },
  });

  const onSubmit = (values: FormValues) => {
    const q = encodeURIComponent(values.search);
    router.push(`/barbershops?search=${q}`);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex items-start gap-2 px-6 mt-4"
      >
        <FormField
          control={form.control}
          name="search"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input
                  placeholder="Buscar estabelecimento, serviços ou endereços..."
                  aria-label="Buscar"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          size="icon"
          className="w-10"
          aria-label="Pesquisar"
        >
          <Search className="h-4 w-4" />
        </Button>
      </form>
    </Form>
  );
};

export default SearchBar;
