import { toast } from 'svelte-sonner';

export type ToastType = 'success' | 'error' | 'info';

export const showToast = (message: string, type: ToastType = 'info', duration = 3500) => {
	toast(message, {
		duration,
		class: 'text-sm font-extralight',
		...(type === 'success'
			? { type: 'success' }
			: type === 'error'
				? { type: 'error' }
				: { type: 'info' })
	});
};
