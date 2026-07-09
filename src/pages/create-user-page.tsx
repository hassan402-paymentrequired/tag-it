import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { z } from 'zod';
import { createUser } from '@/api/users';
import { getErrorMessage } from '@/api/client';
import { AdminLayout } from '@/components/layout/admin-layout';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { AdminPanel } from '@/components/admin/admin-detail-section';
import { FormField } from '@/components/admin/form-field';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { queryKeys } from '@/lib/query-keys';
import { useKnownUsersStore } from '@/stores/known-users-store';
import type { UserRole } from '@/types';

const createUserSchema = z.object({
  email: z.string().email(),
  firstName: z
    .string()
    .min(3, 'Minimum 3 characters')
    .regex(/^[A-Za-z]+$/, 'Letters only'),
  lastName: z
    .string()
    .min(3, 'Minimum 3 characters')
    .regex(/^[A-Za-z]+$/, 'Letters only'),
  role: z.enum(['REQUESTER', 'VERIFIER', 'ADMIN']),
  password: z.string().min(6).max(20),
});

type CreateUserForm = z.infer<typeof createUserSchema>;

export function CreateUserPage() {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateUserForm>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { role: 'REQUESTER' },
  });

  const addKnownUser = useKnownUsersStore((state) => state.addUser);

  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: (response) => {
      toast.success(response.message || 'User created successfully');
      addKnownUser(response.data);
      queryClient.invalidateQueries({ queryKey: queryKeys.users.verifiers });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      reset({
        role: 'REQUESTER',
        email: '',
        firstName: '',
        lastName: '',
        password: '',
      });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  return (
    <AdminLayout
      breadcrumbs={[
        { title: 'Dashboard', href: '/' },
        { title: 'Users', href: '/users' },
        { title: 'Create user' },
      ]}
    >
      <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
        <AdminPageHeader
          eyebrow="Management"
          title="Create user"
          description="Register a new requester, verifier, or admin account."
        />

        <AdminPanel
          title="New account"
          className="max-w-2xl"
        >
          <form
            onSubmit={handleSubmit((values) => mutation.mutate(values))}
            className="grid max-w-xl gap-5"
          >
            <FormField label="Email" htmlFor="email" error={errors.email?.message}>
              <Input id="email" type="email" {...register('email')} />
            </FormField>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                label="First name"
                htmlFor="firstName"
                error={errors.firstName?.message}
              >
                <Input id="firstName" {...register('firstName')} />
              </FormField>
              <FormField
                label="Last name"
                htmlFor="lastName"
                error={errors.lastName?.message}
              >
                <Input id="lastName" {...register('lastName')} />
              </FormField>
            </div>

            <FormField label="Role" htmlFor="role" error={errors.role?.message}>
              <Select
                defaultValue="REQUESTER"
                onValueChange={(value) => setValue('role', value as UserRole)}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="REQUESTER">Requester</SelectItem>
                  <SelectItem value="VERIFIER">Verifier</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </FormField>

            <FormField
              label="Password"
              htmlFor="password"
              error={errors.password?.message}
              hint="6–20 characters"
            >
              <Input id="password" type="password" {...register('password')} />
            </FormField>

            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Creating…' : 'Create user'}
            </Button>
          </form>
        </AdminPanel>
      </div>
    </AdminLayout>
  );
}
