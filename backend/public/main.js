 window.addEventListener('DOMContentLoaded', () => {
 lucide.createIcons()
    document.getElementById('year').textContent = new Date().getFullYear()

    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'))
        btn.classList.add('active')
      })
    })

    document.querySelectorAll('.sidebar-link').forEach(link => {
      link.addEventListener('click', e => {
        document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'))
        e.currentTarget.classList.add('active')
      })
    })
 })