import { useState } from 'react';
import { FileSpreadsheet, FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { getErrorMessage } from '@/api/client';
import type { ExportFormat } from '@/api/export';
import { Button } from '@/components/ui/button';

type Props = {
  onDownload: (format: ExportFormat) => Promise<void>;
  csvLabel?: string;
  pdfLabel?: string;
  variant?: 'default' | 'outline' | 'secondary';
};

export function ExportDownloadButtons({
  onDownload,
  csvLabel = 'CSV',
  pdfLabel = 'PDF',
  variant = 'outline',
}: Props) {
  const [pendingFormat, setPendingFormat] = useState<ExportFormat | null>(null);

  const handleDownload = async (format: ExportFormat) => {
    setPendingFormat(format);
    try {
      await onDownload(format);
      toast.success(`${format.toUpperCase()} download started`);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setPendingFormat(null);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={variant}
        disabled={pendingFormat !== null}
        onClick={() => {
          void handleDownload('csv');
        }}
      >
        {pendingFormat === 'csv' ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <FileSpreadsheet className="size-4" />
        )}
        {pendingFormat === 'csv' ? 'Preparing…' : csvLabel}
      </Button>
      <Button
        variant={variant}
        disabled={pendingFormat !== null}
        onClick={() => {
          void handleDownload('pdf');
        }}
      >
        {pendingFormat === 'pdf' ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <FileText className="size-4" />
        )}
        {pendingFormat === 'pdf' ? 'Preparing…' : pdfLabel}
      </Button>
    </div>
  );
}
