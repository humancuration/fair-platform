import { useState } from "react";
import { motion } from "framer-motion";
import { Form, useSubmit } from "@remix-run/react";
import type { AffiliateLink } from "~/types/models";
import { LinkedContentManager } from "~/components/LinkedContentManager";

interface LinkPageEditorProps {
  initialLinks: AffiliateLink[];
}

export function LinkPageEditor({ initialLinks }: LinkPageEditorProps) {
  const [links, setLinks] = useState(initialLinks);
  const submit = useSubmit();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    submit(formData, { method: "post" });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="link-page-editor p-4"
    >
      <Form onSubmit={handleSubmit} className="space-y-4">
        {/* Form content remains the same */}
      </Form>
    </motion.div>
  );
}
