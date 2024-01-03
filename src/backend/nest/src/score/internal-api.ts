import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class InternalRequestGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const clientIP = request.ip || request.connection.remoteAddress;

    // Ajoutez vos règles pour déterminer ce qui constitue une "requête interne"
    // Par exemple, vérifiez si l'adresse IP appartient à une plage spécifique.

	// Récupérer le mot secret depuis les variables d'environnement
    const secretWord = process.env.INTERNAL_SECRET_WORD;

    const isInternalRequest = isInternalIP(clientIP) && isCorrectSecret(request, secretWord);

    return isInternalRequest;
  }
}

function isCorrectSecret(request: any, secretWord: string): boolean {
	// Ajoutez votre logique pour vérifier si le mot secret est correct
	// Par exemple, vérifiez si le mot secret est présent dans l'en-tête, les paramètres de requête, etc.
	const providedSecret = request.headers['x-internal-secret'] || request.query.internalSecret;
  
	return providedSecret === secretWord;
  }
  
function isInternalIP(ip: string): boolean {
  // Exemple: Vérifiez si l'adresse IP est dans une plage spécifique
  // Vous pouvez personnaliser cette fonction selon vos besoins
  const internalIPRanges = ['192.168.0.0/24', '10.0.0.0/8'];

  return internalIPRanges.some(range => isIPInCIDR(ip, range));
}

function isIPInCIDR(ip: string, cidr: string): boolean {
  const [network, bits] = cidr.split('/');
  const mask = (1 << (32 - parseInt(bits))) - 1;
  const networkInt = ipToInteger(network);
  const ipInt = ipToInteger(ip);

  return (ipInt & mask) === (networkInt & mask);
}

function ipToInteger(ip: string): number {
  return ip.split('.').reduce((acc, octet, index) => acc + parseInt(octet) * Math.pow(256, 3 - index), 0);
}
