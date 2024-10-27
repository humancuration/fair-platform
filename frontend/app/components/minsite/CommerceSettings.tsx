import { motion } from "framer-motion";
import type { Json } from "~/types/models";

interface CommerceSettingsProps {
  settings: Json;
  onChange: (settings: Json) => void;
}

export function CommerceSettings({ settings, onChange }: CommerceSettingsProps) {
  const commerceSettings = settings as {
    enableCommerce?: boolean;
    commissionRate?: number;
    allowAffiliates?: boolean;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="commerce-settings p-4 bg-white rounded-lg shadow"
    >
      <h3 className="text-lg font-semibold mb-4">Commerce Settings</h3>
      
      <div className="space-y-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={commerceSettings.enableCommerce}
            onChange={(e) =>
              onChange({
                ...commerceSettings,
                enableCommerce: e.target.checked,
              })
            }
            className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
          />
          <span>Enable Commerce Features</span>
        </label>

        {commerceSettings.enableCommerce && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="space-y-4 pl-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Commission Rate (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={commerceSettings.commissionRate || 0}
                onChange={(e) =>
                  onChange({
                    ...commerceSettings,
                    commissionRate: Number(e.target.value),
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={commerceSettings.allowAffiliates}
                onChange={(e) =>
                  onChange({
                    ...commerceSettings,
                    allowAffiliates: e.target.checked,
                  })
                }
                className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
              />
              <span>Allow Affiliate Marketing</span>
            </label>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
