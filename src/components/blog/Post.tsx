"use client";

import { Avatar, Column, Flex, Heading, SmartImage, SmartLink, Tag, Text } from "@/once-ui/components";
import styles from "./Posts.module.scss";
import { formatDate } from "@/app/utils/formatDate";
import { person } from "@/app/resources/content";

interface PostProps {
  post: any;
  thumbnail: boolean;
  layout?: "horizontal" | "vertical";
}

export default function Post({ post, thumbnail, layout = "vertical" }: PostProps) {
  const tags = post.metadata.tag?.split(",").map((tag: string) => tag.trim()) ?? [];

  const metadata = (
    <Flex gap="8" vertical="center">
      <Avatar src={person.avatar} size="xs" />
      <Text variant="label-default-s" onBackground="neutral-weak">{person.firstName}</Text>
      <Text variant="label-default-s" onBackground="neutral-weak">·</Text>
      <Text variant="label-default-s" onBackground="neutral-weak">
        {post.metadata.publishedAt && formatDate(post.metadata.publishedAt, false)}
      </Text>
    </Flex>
  );

  if (thumbnail && layout === "horizontal") {
    return (
      <SmartLink fillWidth className={styles.hover} unstyled href={`/blog/${post.slug}`}>
        <Flex fillWidth gap="0" radius="l" overflow="hidden" className={styles.card}>
          {post.metadata.image && (
            <Flex style={{ width: "50%", flexShrink: 0 }}>
              <SmartImage
                priority
                fillWidth
                fillHeight
                sizes="(max-width: 640px) 100vw, 50vw"
                cursor="interactive"
                radius="l"
                src={post.metadata.image}
                alt={"Thumbnail of " + post.metadata.title}
                aspectRatio="16 / 9"
              />
            </Flex>
          )}
          <Column flex={1} gap="12" paddingX="l" paddingY="m" vertical="center">
            {metadata}
            <Heading as="h2" variant="heading-strong-l" wrap="balance">
              {post.metadata.title}
            </Heading>
          </Column>
        </Flex>
      </SmartLink>
    );
  }

  // Default grid card: image top, text below
  return (
    <SmartLink fillWidth className={styles.hover} unstyled href={`/blog/${post.slug}`}>
      <Column fillWidth gap="0" radius="l" overflow="hidden" className={styles.card}>
        {post.metadata.image && thumbnail && (
          <SmartImage
            priority
            fillWidth
            sizes="(max-width: 640px) 100vw, 640px"
            cursor="interactive"
            radius="l"
            src={post.metadata.image}
            alt={"Thumbnail of " + post.metadata.title}
            aspectRatio="16 / 9"
          />
        )}
        <Column fillWidth gap="8" paddingX="m" paddingY="m">
          {metadata}
          <Heading as="h2" variant="heading-strong-m" wrap="balance">
            {post.metadata.title}
          </Heading>
          {tags.length > 0 && (
            <Flex gap="8" wrap>
              {tags.map((tag: string, index: number) =>
                index < 3 ? <Tag key={index} label={tag} variant="neutral" /> : null
              )}
            </Flex>
          )}
        </Column>
      </Column>
    </SmartLink>
  );
}
