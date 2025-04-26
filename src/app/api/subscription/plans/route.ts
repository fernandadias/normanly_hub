import { NextRequest, NextResponse } from 'next/server';
import { SUBSCRIPTION_PLANS } from '../subscription/route';

// Endpoint para obter todos os planos disponíveis
export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      message: 'Planos obtidos com sucesso',
      plans: SUBSCRIPTION_PLANS
    });
  } catch (error: any) {
    console.error('Erro ao obter planos:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Erro interno no servidor'
    }, { status: 500 });
  }
}
