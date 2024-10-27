import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTwitter, FaInstagram, FaLinkedin, FaGithub, FaYoutube } from "react-icons/fa";
import type { Json } from "~/types/models";

interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

interface SocialLinksEditorProps {
  links: Json;
  onChange: (links: Json) => void;
}

const PLATFORMS = [
  { id: "twitter", name: "Twitter", icon: FaTwitter },
  { id: "instagram", name: "Instagram", icon: FaInstagram },
  { id: "linkedin", name: "LinkedIn", icon: FaLinkedin },
  { id: "github", name: "GitHub", icon: FaGithub },
  { id: "youtube", name: "YouTube", icon: FaYoutube },
];

export function SocialLinksEditor({ links, onChange }: SocialLinksEditorProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newLink, setNewLink] = useState<Partial<SocialLink>>({});
  
  const socialLinks = links as SocialLink[];

  const handleAddLink = () => {
    if (newLink.platform && newLink.url) {
      onChange([...socialLinks, { ...newLink, icon: newLink.platform }]);
      setNewLink({});
      setIsAdding(false);
    }
  };

  const handleRemoveLink = (index: number) => {
    const newLinks = [...socialLinks];
    newLinks.splice(index, 1);
    onChange(newLinks);
  };

  return (
    <div className="social-links-editor space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Social Links</h3>
        <button
          onClick={() => setIsAdding(true)}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded"
        >
          Add Link
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3 p-4 bg-gray-50 rounded"
          >
            <select
              value={newLink.platform || ""}
              onChange={(e) => setNewLink({ ...newLink, platform: e.target.value })}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Platform</option>
              {PLATFORMS.map((platform) => (
                <option key={platform.id} value={platform.id}>
                  {platform.name}
                </option>
              ))}
            </select>

            <input
              type="url"
              placeholder="Profile URL"
              value={newLink.url || ""}
              onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
              className="w-full p-2 border rounded"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsAdding(false)}
                className="px-3 py-1 text-sm text-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleAddLink}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded"
              >
                Add
              </button>
            </div>
          </motion.div>
        )}

        <div className="space-y-2">
          {socialLinks.map((link, index) => {
            const Platform = PLATFORMS.find(p => p.id === link.platform)?.icon;
            
            return (
              <motion.div
                key={index}
                layout
                className="flex items-center justify-between p-3 bg-white rounded shadow"
              >
                <div className="flex items-center gap-3">
                  {Platform && <Platform className="text-xl" />}
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {link.url}
                  </a>
                </div>
                <button
                  onClick={() => handleRemoveLink(index)}
                  className="text-red-500 hover:text-red-600"
                >
                  Remove
                </button>
              </motion.div>
            );
          })}
        </div>
      </AnimatePresence>
    </div>
  );
}
