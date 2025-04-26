"use client"

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Upload, X, GripVertical, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AnalysisImage } from '@/types/analysis'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface ImageUploadProps {
  images: AnalysisImage[];
  onChange: (images: AnalysisImage[]) => void;
  maxImages?: number;
}

export function ImageUpload({ images, onChange, maxImages = 7 }: ImageUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newImages = acceptedFiles.map((file, index) => ({
      file,
      order: images.length + index,
      isStart: false,
      isEnd: false
    }));

    if (images.length + acceptedFiles.length > maxImages) {
      alert(`Máximo de ${maxImages} imagens permitido`);
      return;
    }

    const allImages = [...images, ...newImages];
    updateImageFlags(allImages);
  }, [images, onChange, maxImages]);

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
    maxFiles: maxImages - images.length,
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Sequência de Telas</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>Faça upload de até {maxImages} imagens que representam o fluxo de interação.</p>
                <p className="mt-1">A primeira imagem será considerada o início do fluxo e a última o fim.</p>
                <p className="mt-1">Você pode reordenar as imagens arrastando-as.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <span className="text-xs text-muted-foreground">
          {images.length}/{maxImages} imagens
        </span>
      </div>
      
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${isDragActive ? 'border-primary bg-primary/10' : 'border'}
          ${images.length >= maxImages ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onClick={(e) => {
          if (images.length > 0) {
            e.stopPropagation();
          }
        }}
      >
        <input {...getInputProps()} disabled={images.length >= maxImages} />
        
        {images.length === 0 ? (
          <>
            <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              Arraste imagens ou clique para selecionar
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Recomendado: Inclua telas de início, interações principais e fim do fluxo
            </p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            {images.length >= maxImages 
              ? `Limite máximo de ${maxImages} imagens atingido`
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
                          <div className="absolute -top-2 -left-2 flex items-center justify-center h-6 w-6 bg-background rounded-full border text-xs font-medium">
                            {index + 1}
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
                          {!image.isStart && !image.isEnd && (
                            <span className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                              Interação
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
