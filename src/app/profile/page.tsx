"use client"

import { MainLayout } from '@/components/layout/main-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User, Mail, Building, Globe } from 'lucide-react'

const mockUser = {
  name: 'João Silva',
  email: 'joao.silva@exemplo.com',
  company: 'Tech Solutions',
  website: 'techsolutions.com.br',
  avatar: 'https://github.com/shadcn.png'
}

export default function ProfilePage() {
  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto space-y-6 px-4 md:px-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Perfil</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie suas informações pessoais
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row items-center gap-4">
              <Avatar className="h-20 w-20 md:h-16 md:w-16">
                <AvatarImage src={mockUser.avatar} />
                <AvatarFallback>{mockUser.name[0]}</AvatarFallback>
              </Avatar>
              <div className="text-center md:text-left">
                <CardTitle>{mockUser.name}</CardTitle>
                <CardDescription>Membro desde Janeiro 2024</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Nome</Label>
              <div className="flex flex-col md:flex-row gap-2">
                <Input
                  defaultValue={mockUser.name}
                  className="flex-1"
                />
                <Button variant="outline" className="md:w-24">Alterar</Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <div className="flex flex-col md:flex-row gap-2">
                <Input
                  defaultValue={mockUser.email}
                  className="flex-1"
                  type="email"
                />
                <Button variant="outline" className="md:w-24">Alterar</Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Empresa</Label>
              <div className="flex flex-col md:flex-row gap-2">
                <Input
                  defaultValue={mockUser.company}
                  className="flex-1"
                />
                <Button variant="outline" className="md:w-24">Alterar</Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Website</Label>
              <div className="flex flex-col md:flex-row gap-2">
                <Input
                  defaultValue={mockUser.website}
                  className="flex-1"
                />
                <Button variant="outline" className="md:w-24">Alterar</Button>
              </div>
            </div>

            <div className="pt-4">
              <Button className="w-full">Salvar Alterações</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Configurações de Segurança</CardTitle>
            <CardDescription>
              Gerencie suas preferências de segurança
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="font-medium">Autenticação de Dois Fatores</div>
                <div className="text-sm text-muted-foreground">
                  Adicione uma camada extra de segurança à sua conta
                </div>
              </div>
              <Button variant="outline" className="md:w-32">Configurar</Button>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="font-medium">Alterar Senha</div>
                <div className="text-sm text-muted-foreground">
                  Atualize sua senha periodicamente
                </div>
              </div>
              <Button variant="outline" className="md:w-32">Alterar</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
} 