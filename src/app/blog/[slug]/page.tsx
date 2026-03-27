import { notFound } from "next/navigation";
import { CustomMDX } from "@/components/mdx";
import { getPosts } from "@/app/utils/utils";
import { Avatar, Column, Flex, Grid, Heading, SmartImage, SmartLink, Text } from "@/once-ui/components";
import { baseURL } from "@/app/resources";
import { person } from "@/app/resources/content";
import { formatDate } from "@/app/utils/formatDate";
import ScrollToHash from "@/components/ScrollToHash";
import Post from "@/components/blog/Post";

interface BlogParams {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const posts = getPosts(["src", "app", "blog", "posts"]);
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata(props: BlogParams) {
  const params = await props.params;
  let post = getPosts(["src", "app", "blog", "posts"]).find((post) => post.slug === params.slug);

  if (!post) {
    return;
  }

  let { title, publishedAt: publishedTime, summary: description, image } = post.metadata;
  let ogImage = image ? `https://${baseURL}${image}` : `https://${baseURL}/og?title=${title}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime,
      url: `https://${baseURL}/blog/${post.slug}`,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function BlogPost(props: BlogParams) {
  const params = await props.params;
  const allPosts = getPosts(["src", "app", "blog", "posts"]);
  let post = allPosts.find((post) => post.slug === params.slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = allPosts
    .filter((p) => p.slug !== params.slug)
    .sort((a, b) => new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime())
    .slice(0, 2);

  return (
    <Column as="section" fillWidth horizontal="center" gap="l">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.metadata.title,
            datePublished: post.metadata.publishedAt,
            dateModified: post.metadata.publishedAt,
            description: post.metadata.summary,
            image: post.metadata.image
              ? `https://${baseURL}${post.metadata.image}`
              : `https://${baseURL}/og?title=${post.metadata.title}`,
            url: `https://${baseURL}/blog/${post.slug}`,
            author: {
              "@type": "Person",
              name: person.name,
            },
          }),
        }}
      />

      {/* Centered "Blog" breadcrumb link */}
      <Flex horizontal="center" fillWidth>
        <SmartLink href="/blog" unstyled>
          <Text variant="label-default-s" onBackground="neutral-weak">
            Blog
          </Text>
        </SmartLink>
      </Flex>

      {/* Date */}
      <Flex horizontal="center" fillWidth>
        <Text variant="label-default-s" onBackground="neutral-weak">
          {post.metadata.publishedAt && formatDate(post.metadata.publishedAt, false)}
        </Text>
      </Flex>

      {/* Title and tagline — narrow column, centered */}
      <Column maxWidth="s" horizontal="center" gap="m">
        <Heading as="h1" variant="display-strong-s" align="center" wrap="balance">
          {post.metadata.title}
        </Heading>
        {post.metadata.summary && (
          <Text variant="display-default-xs" onBackground="neutral-weak" align="center" wrap="balance">
            {post.metadata.summary}
          </Text>
        )}
      </Column>

      {/* Author */}
      <Flex horizontal="center" vertical="center" gap="8">
        <Avatar src={person.avatar} size="m" />
        <Text variant="body-default-s">{person.name}</Text>
      </Flex>

      {/* Hero image — wider than text content */}
      {post.metadata.image && (
        <Flex fillWidth maxWidth="l" horizontal="center">
          <SmartImage
            priority
            fillWidth
            radius="l"
            src={post.metadata.image}
            alt={post.metadata.title}
            aspectRatio="16 / 9"
            sizes="(max-width: 768px) 100vw, 1200px"
          />
        </Flex>
      )}

      {/* MDX content — narrow readable width */}
      <Column as="article" maxWidth="s" fillWidth>
        <CustomMDX source={post.content} />
      </Column>

      {/* Read Next Section */}
      {relatedPosts.length > 0 && (
        <Column fillWidth gap="xl" horizontal="center" marginTop="160" marginBottom="160">
          <Flex fillWidth maxWidth="s" horizontal="center">
            <Heading as="h2" variant="display-strong-xs" align="center">
              Read Next
            </Heading>
          </Flex>
          <Grid columns="2" gap="l" mobileColumns="1" fillWidth maxWidth="m">
            {relatedPosts.map((relatedPost) => (
              <Post key={relatedPost.slug} post={relatedPost} thumbnail={true} />
            ))}
          </Grid>
        </Column>
      )}

      <ScrollToHash />
    </Column>
  );
}