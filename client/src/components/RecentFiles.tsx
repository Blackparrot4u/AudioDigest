import { Play, Layers, Download, File as FileIcon, FileText, FileImage } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import type { File as AppFile } from "@shared/schema";

interface RecentFilesProps {
  files: AppFile[];
}

export default function RecentFiles({ files }: RecentFilesProps) {
  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <FileIcon className="text-red-600 dark:text-red-400 text-sm" />;
    if (type.includes('image')) return <FileImage className="text-blue-600 dark:text-blue-400 text-sm" />;
    if (type.includes('word')) return <FileText className="text-blue-600 dark:text-blue-400 text-sm" />;
    return <FileText className="text-slate-600 dark:text-slate-400 text-sm" />;
  };

  const getFileIconBg = (type: string) => {
    if (type.includes('pdf')) return "bg-red-100 dark:bg-red-900";
    if (type.includes('image')) return "bg-blue-100 dark:bg-blue-900";
    if (type.includes('word')) return "bg-blue-100 dark:bg-blue-900";
    return "bg-slate-100 dark:bg-slate-700";
  };

  if (!files.length) {
    return (
      <section className="mt-8">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FileText className="mr-2 text-primary" />
            Recent Files
          </h3>
          <div className="text-center py-8">
            <p className="text-slate-600 dark:text-slate-400">
              No files uploaded yet. Start by uploading your first document to generate summaries and flashcards.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-8">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <FileText className="mr-2 text-primary" />
          Recent Files
        </h3>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-slate-200 dark:border-slate-700">
                <TableHead className="text-left py-3 px-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                  File
                </TableHead>
                <TableHead className="text-left py-3 px-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                  Type
                </TableHead>
                <TableHead className="text-left py-3 px-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                  Processed
                </TableHead>
                <TableHead className="text-left py-3 px-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {files.map((file) => (
                <TableRow 
                  key={file.id}
                  data-testid={`file-row-${file.id}`}
                  className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  <TableCell className="py-3 px-2">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded flex items-center justify-center ${getFileIconBg(file.type)}`}>
                        {getFileIcon(file.type)}
                      </div>
                      <span data-testid="text-filename" className="font-medium">{file.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 px-2 text-slate-600 dark:text-slate-400">
                    {file.type.split('/')[1]?.toUpperCase() || 'Unknown'}
                  </TableCell>
                  <TableCell className="py-3 px-2 text-slate-600 dark:text-slate-400">
                    {file.createdAt ? formatDistanceToNow(new Date(file.createdAt), { addSuffix: true }) : 'Unknown'}
                  </TableCell>
                  <TableCell className="py-3 px-2">
                    <div className="flex space-x-2">
                      <Button
                        data-testid="button-play-audio"
                        variant="ghost"
                        size="sm"
                        className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-600"
                        disabled={!file.processed}
                        title="Play Audio"
                      >
                        <Play className="h-4 w-4 text-primary" />
                      </Button>
                      <Button
                        data-testid="button-view-flashcards"
                        variant="ghost"
                        size="sm"
                        className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-600"
                        disabled={!file.flashcards?.length}
                        title="View Flashcards"
                      >
                        <Layers className="h-4 w-4 text-secondary" />
                      </Button>
                      <Button
                        data-testid="button-download"
                        variant="ghost"
                        size="sm"
                        className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-600"
                        disabled={!file.audioUrl}
                        title="Download Audio"
                      >
                        <Download className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
}
