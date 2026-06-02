import Swal from 'sweetalert2';

export function showToast(message, icon = 'error') {
  Swal.fire({
    toast: true,
    position: 'top-end',
    icon,
    title: message,
    showConfirmButton: false,
    timer: 4000,
    timerProgressBar: true,
  });
}
