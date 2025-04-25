"use client"

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Upload, X, GripVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AnalysisImage } from '@/types/analysis'

interface ImageUploadProps {
  images: AnalysisImage[];
  onChange: (images: AnalysisImage[]) => void;
}

export function ImageUpload({ images, onChange }: ImageUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newImages = acceptedFiles.map((file, index) => ({
      file,
      order: images.length + index,
      isStart: images.length === 0 && index === 0,
      isEnd: index === acceptedFiles.length - 1
    }));

    if (images.length + acceptedFiles.length > 5) {
      alert('Máximo de 5 imagens permitido');
      return;
    }

    onChange([...images, ...newImages]);
  }, [images, onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {'image/*': []},
    maxFiles: 5 - images.length,
    onDrop
  });

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const reorderedImages = Array.from(images);
    const [removed] = reorderedImages.splice(result.source.index, 1);
    reorderedImages.splice(result.destination.index, 0, removed);

    // Atualiza a ordem
    const updatedImages = reorderedImages.map((img, index) => ({
      ...img,
      order: index,
      isStart: index === 0,
      isEnd: index === reorderedImages.length - 1
    }));

    onChange(updatedImages);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index).map((img, i) => ({
      ...img,
      order: i,
      isStart: i === 0,
      isEnd: i === images.length - 2
    }));
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${isDragActive ? 'border-primary bg-primary/10' : 'border-border'}
          ${images.length >= 5 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <input {...getInputProps()} disabled={images.length >= 5} />
        <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">
          {images.length >= 5 
            ? 'Limite máximo de 5 imagens atingido'
            : 'Arraste imagens ou clique para selecionar'}
        </p>
      </div>

      {images.length > 0 && (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="images">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2"
              >
                {images.map((image, index) => (
                  <Draggable
                    key={image.file.name + index}
                    draggableId={image.file.name + index}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="flex items-center gap-2 p-2 bg-card rounded-md"
                      >
                        <div {...provided.dragHandleProps}>
                          <GripVertical className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <img
                          src={URL.createObjectURL(image.file)}
                          alt={`Upload ${index + 1}`}
                          className="h-16 w-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium truncate">
                            {image.file.name}
                          </p>
                          <div className="flex gap-2 mt-1">
                            {image.isStart && (
                              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                                Início
                              </span>
                            )}
                            {image.isEnd && (
                              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                                Fim
                              </span>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
} 