import { baseURL } from "@/app/resources";
import { projects } from "@/app/resources/content";
import { AIChat } from "@/components/ai/AIChat";
import { Column } from "@/once-ui/components";

export async function generateMetadata() {
  const title = projects.title;
  const description = projects.description;
  const ogImage = `https://${baseURL}/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://${baseURL}/ai`,
      images: [
        {
          url: ogImage,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default function AIPage() {
  return (
    <Column fillWidth maxWidth="l">
      <AIChat />
    </Column>
  );
}
