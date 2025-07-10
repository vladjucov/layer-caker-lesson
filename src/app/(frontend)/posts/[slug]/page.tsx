import { POST_QUERY, POSTS_SLUGS_QUERY } from "@/sanity/lib/queries";
import { Post } from '@/components/Post'
import { notFound } from 'next/navigation'
import { client, sanityFetch } from '@/sanity/lib/client'


export async function generateStaticParams() {
    const slugs = await client
        .withConfig({useCdn: false})
        .fetch(POSTS_SLUGS_QUERY);

    return slugs
}
export default async function Page({
                                       params,
                                   }: {
    params: Promise<{ slug: string }>;
}) {
    const post = await sanityFetch({
        query: POST_QUERY,
        params,
        tags: [`post:${(await params).slug}`, 'author', 'category'],
    })

    if (!post) {
        notFound()
    }

    return (
        <main className="container mx-auto grid grid-cols-1 gap-6 p-12">
            <Post {...post} />
        </main>
    )
}
