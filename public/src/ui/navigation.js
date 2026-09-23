export function initNavigation() {
  document.querySelectorAll('.menu button').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.menu button').forEach(item => item.classList.toggle('active', item === button));
      document.querySelectorAll('.page').forEach(page => page.classList.toggle('active', page.id === button.dataset.page));
    });
  });

  const toggleSidebarBtn = document.getElementById('toggleSidebar');
  const appContainer = document.querySelector('.app');
  if (toggleSidebarBtn && appContainer) {
    toggleSidebarBtn.addEventListener('click', () => {
      appContainer.classList.toggle('sidebar-collapsed');
    });
  }
}
