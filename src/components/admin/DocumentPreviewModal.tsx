
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, Image, X } from 'lucide-react';

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentUrl: string;
  documentType: 'id_card' | 'profile_photo';
  userName: string;
}

const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  isOpen,
  onClose,
  documentUrl,
  documentType,
  userName
}) => {
  const isImage = documentType === 'profile_photo' || documentUrl?.includes('image') || 
                  documentUrl?.match(/\.(jpg|jpeg|png|gif|webp)$/i);

  const getDocumentTitle = () => {
    switch (documentType) {
      case 'id_card':
        return 'KTP / Kartu Identitas';
      case 'profile_photo':
        return 'Foto Profil';
      default:
        return 'Dokumen';
    }
  };

  const handleDownload = () => {
    if (documentUrl) {
      const link = document.createElement('a');
      link.href = documentUrl;
      link.download = `${userName}-${documentType}`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isImage ? <Image className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            {getDocumentTitle()} - {userName}
          </DialogTitle>
          <DialogDescription>
            Preview dokumen yang diupload oleh user
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Document Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {documentType === 'id_card' ? 'Identitas' : 'Foto Profil'}
              </Badge>
              <span className="text-sm text-gray-500">
                {documentUrl ? 'Dokumen tersedia' : 'Dokumen tidak tersedia'}
              </span>
            </div>
            
            {documentUrl && (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleDownload}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </Button>
            )}
          </div>

          {/* Document Preview */}
          <div className="border rounded-lg p-4 bg-gray-50">
            {documentUrl ? (
              <div className="text-center">
                {isImage ? (
                  <div className="space-y-4">
                    <img 
                      src={documentUrl} 
                      alt={getDocumentTitle()}
                      className="max-w-full max-h-96 mx-auto rounded-lg shadow-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <div className="hidden">
                      <FileText className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Gagal memuat gambar</p>
                      <Button 
                        variant="outline" 
                        onClick={() => window.open(documentUrl, '_blank')}
                        className="mt-2"
                      >
                        Buka di Tab Baru
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="py-8">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">
                      Dokumen tersedia tetapi tidak dapat dipreview langsung
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => window.open(documentUrl, '_blank')}
                    >
                      Buka Dokumen
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <X className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <p className="text-red-600">Dokumen tidak tersedia</p>
                <p className="text-sm text-gray-500 mt-2">
                  User belum mengupload dokumen ini
                </p>
              </div>
            )}
          </div>

          {/* Additional Info */}
          <div className="text-xs text-gray-500 space-y-1">
            <p><strong>Tips:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Periksa kualitas dan kejelasan dokumen</li>
              <li>Pastikan informasi pada dokumen sesuai dengan data profil</li>
              <li>Untuk KTP, pastikan tidak ada informasi yang tertutup atau blur</li>
              <li>Untuk foto profil, pastikan wajah terlihat jelas</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentPreviewModal;
