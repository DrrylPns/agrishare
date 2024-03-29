"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { TransferSchema, TransferType } from "@/lib/validations/transfer";
import { transferPoints } from "../../../../../actions/transfer";


export const TransferForm = () => {
    const [isPending, startTransition] = useTransition();

    const form = useForm<TransferType>({
        resolver: zodResolver(TransferSchema),
    });

    const onSubmit = (values: TransferType) => {
        startTransition(() => {
            transferPoints(values)
                .then((data) => {
                    if (data.error) {
                        toast({
                            description: data.error,
                            variant: "destructive"
                        })
                    }

                    if (data.success) {
                        toast({
                            description: data.success
                        })
                    }
                })
        })
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 p-5"
            >
                <div className="space-y-2">
                    <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Amount</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        disabled={isPending}
                                        placeholder="100"
                                        type="number"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="userId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>User-ID</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        disabled={isPending}
                                        placeholder="John"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        disabled={isPending}
                                        placeholder="******"
                                        type="password"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="purpose"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Purpose (Optional)</FormLabel>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        disabled={isPending}
                                        placeholder="...."
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Button
                    isLoading={isPending}
                    type="submit"
                    className="w-full"
                    variant="primary"
                >
                    Transfer
                </Button>
            </form>
        </Form>
    );
};