import { Sliders } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function QuickSettings() {
  return (
    <section className="mb-8">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Sliders className="mr-2 text-primary" />
          Summary Settings
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Summary Length */}
          <div>
            <Label htmlFor="summary-length" className="block text-sm font-medium mb-2">
              Summary Length
            </Label>
            <Select defaultValue="standard">
              <SelectTrigger data-testid="select-summary-length">
                <SelectValue placeholder="Select length" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="time-crunch">Time Crunch (&lt; 2 min)</SelectItem>
                <SelectItem value="standard">Standard (3-5 min)</SelectItem>
                <SelectItem value="detailed">Detailed (5-10 min)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Language */}
          <div>
            <Label htmlFor="language" className="block text-sm font-medium mb-2">
              Language
            </Label>
            <Select defaultValue="en">
              <SelectTrigger data-testid="select-language">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="de">German</SelectItem>
                <SelectItem value="zh">Chinese</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Voice Speed */}
          <div>
            <Label htmlFor="voice-speed" className="block text-sm font-medium mb-2">
              Voice Speed
            </Label>
            <Select defaultValue="1.0">
              <SelectTrigger data-testid="select-voice-speed">
                <SelectValue placeholder="Select speed" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0.75">Slow (0.75x)</SelectItem>
                <SelectItem value="1.0">Normal (1.0x)</SelectItem>
                <SelectItem value="1.25">Fast (1.25x)</SelectItem>
                <SelectItem value="1.5">Very Fast (1.5x)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </section>
  );
}
