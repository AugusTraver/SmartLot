import Swal from 'sweetalert2';
import { Z_INDEX } from './zIndex';
import { mensajeToast } from './erroresMensajes';

export function showToast(message, icon = 'error') {
  Swal.fire({
    toast: true,
    position: 'top-end',
    icon,
    title: mensajeToast(message),
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    zIndex: Z_INDEX.SWAL_TOAST,
  });
}
