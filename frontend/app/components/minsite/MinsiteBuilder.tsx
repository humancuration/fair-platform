import { Form, useSubmit, useNavigation } from "@remix-run/react";
import { useState } from "react";
import { motion } from "framer-motion";
import { WYSIWYGEditor } from "./WYSIWYGEditor";
import { TemplateSelector } from "./TemplateSelector";
import { MinsitePreview } from "./MinsitePreview";
import { SEOMetadataEditor } from "./SEOMetadataEditor";
import { CommerceSettings } from "./CommerceSettings";
import { VersionHistory } from "./VersionHistory";
import type { Minsite, Json } from "~/types/models";

interface MinsiteBuilderProps {
  initialData: Minsite;
  actionData?: {
    success?: boolean;
    error?: string;
  };
}

export function MinsiteBuilder({ initialData, actionData }: MinsiteBuilderProps) {
  const submit = useSubmit();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const [content, setContent] = useState<Json>(initialData.content);
  const [title, setTitle] = useState(initialData.title);
  const [template, setTemplate] = useState(initialData.template);
  const [customCSS, setCustomCSS] = useState(initialData.customCSS || "");
  const [seoMetadata, setSeoMetadata] = useState(initialData.seoMetadata || {});
  const [settings, setSettings] = useState(initialData.settings || {});

  const handleSave = () => {
    const formData = new FormData();
    formData.set("intent", "save");
    formData.set("title", title);
    formData.set("content", JSON.stringify(content));
    formData.set("template", template);
    formData.set("customCSS", customCSS);
    formData.set("seoMetadata", JSON.stringify(seoMetadata));
    formData.set("settings", JSON.stringify(settings));

    submit(formData, { method: "post" });
  };

  const handlePublish = () => {
    const formData = new FormData();
    formData.set("intent", "publish");
    submit(formData, { method: "post" });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto p-4"
    >
      {actionData?.error && (
        <div className="bg-red-50 text-red-500 p-4 rounded mb-4">
          {actionData.error}
        </div>
      )}

      <Form method="post" className="space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="w-full lg:w-2/3">
            <input
              type="text"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Minsite Title"
            />

            <WYSIWYGEditor
              content={content as string}
              onChange={(value) => setContent(value)}
            />

            <TemplateSelector
              selected={template}
              onSelect={setTemplate}
            />

            <SEOMetadataEditor
              metadata={seoMetadata}
              onChange={setSeoMetadata}
            />

            <CommerceSettings
              settings={settings}
              onChange={setSettings}
            />

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSave}
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                {isSubmitting ? "Saving..." : "Save"}
              </button>

              <button
                type="button"
                onClick={handlePublish}
                disabled={isSubmitting || initialData.isPublished}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                {initialData.isPublished ? "Published" : "Publish"}
              </button>
            </div>
          </div>

          <div className="w-full lg:w-1/3">
            <MinsitePreview
              title={title}
              content={content as string}
              customCSS={customCSS}
              components={[]}
            />

            <VersionHistory
              versions={initialData.versions}
              onRevert={(version) => {
                setContent(version.content);
                setTitle(version.title);
                if (version.template) setTemplate(version.template);
                if (version.customCSS) setCustomCSS(version.customCSS);
              }}
            />
          </div>
        </div>
      </Form>
    </motion.div>
  );
}
