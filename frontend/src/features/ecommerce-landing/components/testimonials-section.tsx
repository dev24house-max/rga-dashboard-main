import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Star, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/i18n/use-translation';

const TESTIMONIALS = [
    {
        id: 1,
        nameKey: 'testimonials.reviews.dew.name',
        roleKey: 'testimonials.reviews.dew.role',
        contentKey: 'testimonials.reviews.dew.content',
        avatarKey: 'testimonials.reviews.dew.avatar',
        rating: 5,
    },
    {
        id: 2,
        nameKey: 'testimonials.reviews.un.name',
        roleKey: 'testimonials.reviews.un.role',
        contentKey: 'testimonials.reviews.un.content',
        avatarKey: 'testimonials.reviews.un.avatar',
        rating: 5,
    },
    {
        id: 3,
        nameKey: 'testimonials.reviews.dong.name',
        roleKey: 'testimonials.reviews.dong.role',
        contentKey: 'testimonials.reviews.dong.content',
        avatarKey: 'testimonials.reviews.dong.avatar',
        rating: 4,
    },
];

export function TestimonialsSection() {
    const { t } = useTranslation('ecommerce');

    return (
        <section className="w-full py-20 bg-white dark:bg-zinc-900">
            <div className="container px-4 mx-auto max-w-6xl">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-zinc-100 sm:text-4xl">
                        {t('testimonials.title')}
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto">
                        {t('testimonials.subtitle')}
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 items-start">
                    {TESTIMONIALS.map((review) => (
                        <TestimonialCard key={review.id} review={review} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function TestimonialCard({ review }: { review: (typeof TESTIMONIALS)[0] }) {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useTranslation('ecommerce');
    const name = t(review.nameKey);

    return (
        <Card
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
                'border-0 shadow-lg bg-white/80 dark:bg-zinc-800/50 backdrop-blur-sm transition-all duration-300 cursor-pointer overflow-hidden group',
                'hover:bg-white dark:hover:bg-zinc-800 hover:shadow-xl hover:-translate-y-1'
            )}
        >
            <CardHeader className="flex flex-row items-center gap-4 pb-2 select-none">
                <Avatar className="h-12 w-12 border-2 border-white dark:border-zinc-700 shadow-sm">
                    <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`}
                        alt={name}
                    />
                    <AvatarFallback className="bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 font-bold">
                        {t(review.avatarKey)}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <div className="font-semibold text-slate-900 dark:text-zinc-100">
                        {name}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-zinc-500">
                        {t(review.roleKey)}
                    </div>
                </div>
                <ChevronDown
                    className={cn(
                        'w-5 h-5 text-slate-300 dark:text-zinc-500 transition-transform duration-300 group-hover:text-indigo-500 dark:group-hover:text-indigo-400',
                        isOpen && 'rotate-180'
                    )}
                />
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
                <div className="flex gap-0.5 mt-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                            key={i}
                            className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-slate-200 dark:fill-zinc-600 text-slate-200 dark:text-zinc-600'}`}
                        />
                    ))}
                </div>

                <div
                    className={cn(
                        'grid transition-all duration-300 ease-in-out',
                        isOpen
                            ? 'grid-rows-[1fr] opacity-100'
                            : 'grid-rows-[0fr] opacity-0'
                    )}
                >
                    <div className="overflow-hidden">
                        <p className="text-slate-600 dark:text-zinc-400 leading-relaxed italic pt-2 border-t border-slate-100 dark:border-zinc-700 mt-2">
                            "{t(review.contentKey)}"
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
