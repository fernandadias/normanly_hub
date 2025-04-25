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
      isStart: false,
      isEnd: false
    }));

    if (images.length + acceptedFiles.length > 5) {
      alert('Máximo de 5 imagens permitido');
      return;
    }

    const allImages = [...images, ...newImages];
    updateImageFlags(allImages);
  }, [images, onChange]);

  const updateImageFlags = (imgs: AnalysisImage[]) => {
    const updatedImages = imgs.map((img, index) => ({
      ...img,
      order: index,
      isStart: index === 0,
      isEnd: index === imgs.length - 1 || imgs.length === 1
    }));
    onChange(updatedImages);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {'image/*': []},
    maxFiles: 5 - images.length,
    onDrop,
    noClick: images.length > 0
  });

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const reorderedImages = Array.from(images);
    const [removed] = reorderedImages.splice(result.source.index, 1);
    reorderedImages.splice(result.destination.index, 0, removed);
    updateImageFlags(reorderedImages);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    updateImageFlags(newImages);
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${isDragActive ? 'border-primary bg-primary/10' : 'border-border'}
          ${images.length >= 5 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onClick={(e) => {
          if (images.length > 0) {
            e.stopPropagation();
          }
        }}
      >
        <input {...getInputProps()} disabled={images.length >= 5} />
        
        {images.length === 0 ? (
          <>
            <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              Arraste imagens ou clique para selecionar
            </p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            {images.length >= 5 
              ? 'Limite máximo de 5 imagens atingido'
              : 'Arraste mais imagens para adicionar'}
          </p>
        )}
      </div>
      
      {images.length > 0 && (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="images" direction="horizontal">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="flex flex-wrap gap-4"
              >
                {images.map((image, index) => (
                  <Draggable
                    key={image.file.name + index}
                    draggableId={image.file.name + index}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`relative group ${snapshot.isDragging ? 'z-50' : ''}`}
                      >
                        <div className="relative w-24 h-24">
                          <img
                            src={URL.createObjectURL(image.file)}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-full object-cover rounded-md"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute -top-2 -right-2 h-6 w-6 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeImage(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <div 
                            {...provided.dragHandleProps}
                            className="absolute bottom-0 left-0 right-0 flex gap-1 justify-center p-1 bg-background/80 backdrop-blur-sm rounded-b-md cursor-grab active:cursor-grabbing"
                          >
                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                        <div className="absolute -bottom-6 left-0 right-0 flex gap-1 justify-center">
                          {image.isStart && (
                            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                              Início
                            </span>
                          )}
                          {image.isEnd && (
                            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                              Fim
                            </span>
                          )}
                        </div>
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