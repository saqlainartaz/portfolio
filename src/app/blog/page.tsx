import { Column, Heading, Text } from "@/once-ui/components";
import { Mailchimp } from "@/components";
import { Posts } from "@/components/blog/Posts";
import { baseURL } from "@/app/resources";
import { blog, person, newsletter } from "@/app/resources/content";

export async function generateMetadata() {
  const title = blog.title;
  const description = blog.description;
  const ogImage = `https://${baseURL}/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://${baseURL}/blog`,
      images: [{ url: ogImage, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default function Blog() {
  return (
    <Column maxWidth="m">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            headline: blog.title,
            description: blog.description,
            url: `https://${baseURL}/blog`,
            image: `${baseURL}/og?title=${encodeURIComponent(blog.title)}`,
            author: {
              "@type": "Person",
              name: person.name,
              image: {
                "@type": "ImageObject",
                url: `${baseURL}${person.avatar}`,
              },
            },
          }),
        }}
      />

      {/* Page heading */}
      <Heading marginBottom="l" paddingTop="l" variant="heading-strong-xl">
        {blog.title}
      </Heading>

      {/* Top 3 posts: 1 featured + 2-col grid */}
      <Column fillWidth flex={1} gap="m">
        <Posts range={[1, 1]} thumbnail layout="horizontal" />
        <Posts range={[2, 3]} columns="2" thumbnail />
      </Column>

      {/* Newsletter above earlier posts */}
      {newsletter.display && <Mailchimp newsletter={newsletter} />}

      {/* Earlier posts */}
      <Column fillWidth gap="m" paddingTop="xl">
        <Heading as="h2" variant="heading-strong-l">Earlier posts</Heading>
        <Posts range={[4]} columns="2" />
      </Column>
    </Column>
  );
}
