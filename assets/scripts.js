// Modal Management System - Optimized with DRY principles

class ModalManager {
  constructor(modalId, headerId) {
    this.modal = document.getElementById(modalId);
    this.header = document.getElementById(headerId);
    this.isDragging = false;
    this.offset = { x: 0, y: 0 };
    
    this.initDragHandlers();
  }

  open() {
    // Close all other modals before opening this one
    ModalManager.closeAll(this.modal);
    
    this.modal.classList.add('active');
    this.centerModal();
  }

  close() {
    this.modal.classList.remove('active', 'fullscreen');
  }

  toggleFullscreen() {
    this.modal.classList.toggle('fullscreen');
    if (!this.modal.classList.contains('fullscreen')) {
      this.centerModal();
    }
  }

  centerModal() {
    const rect = this.modal.getBoundingClientRect();
    this.modal.style.left = `${(window.innerWidth - rect.width) / 2}px`;
    this.modal.style.top = `${(window.innerHeight - rect.height) / 2}px`;
  }

  initDragHandlers() {
    this.header.addEventListener('mousedown', (e) => this.handleMouseDown(e));
    document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    document.addEventListener('mouseup', () => this.handleMouseUp());
  }

  handleMouseDown(e) {
    if (this.modal.classList.contains('fullscreen')) return;
    if (e.target.closest('.control-btn')) return;

    this.isDragging = true;
    this.offset.x = e.clientX - this.modal.offsetLeft;
    this.offset.y = e.clientY - this.modal.offsetTop;
    this.modal.style.cursor = 'grabbing';
    this.header.style.cursor = 'grabbing';
  }

  handleMouseMove(e) {
    if (!this.isDragging) return;

    e.preventDefault();
    const rect = this.modal.getBoundingClientRect();
    
    let newX = e.clientX - this.offset.x;
    let newY = e.clientY - this.offset.y;

    // Constrain to viewport
    const maxX = window.innerWidth - rect.width;
    const maxY = window.innerHeight - rect.height;

    newX = Math.max(0, Math.min(newX, maxX));
    newY = Math.max(0, Math.min(newY, maxY));

    this.modal.style.left = `${newX}px`;
    this.modal.style.top = `${newY}px`;
  }

  handleMouseUp() {
    if (!this.isDragging) return;

    this.isDragging = false;
    this.modal.style.cursor = '';
    this.header.style.cursor = 'move';
  }

  // Static method to close all modals except the one being opened
  static closeAll(exceptModal = null) {
    ModalManager.instances.forEach(instance => {
      if (instance.modal !== exceptModal) {
        instance.close();
      }
    });
  }

  // Store all instances for easy access
  static instances = [];
  
  static registerInstance(instance) {
    ModalManager.instances.push(instance);
  }
}

// Initialize modal instances
const aboutModal = new ModalManager('modal', 'modalHeader');
const projectsModalInstance = new ModalManager('projectsModal', 'projectsModalHeader');
const experienceModalInstance = new ModalManager('experienceModal', 'experienceModalHeader');

// Register instances
ModalManager.registerInstance(aboutModal);
ModalManager.registerInstance(projectsModalInstance);
ModalManager.registerInstance(experienceModalInstance);

// Public API - Keep function names as required
function openModal() {
  aboutModal.open();
}

function closeModal() {
  aboutModal.close();
}

function toggleFullscreen() {
  aboutModal.toggleFullscreen();
}

function openProjectsModal() {
  projectsModalInstance.open();
}

function closeProjectsModal() {
  projectsModalInstance.close();
}

function toggleFullscreenProjects() {
  projectsModalInstance.toggleFullscreen();
}

function openExperienceModal() {
  experienceModalInstance.open();
}

function closeExperienceModal() {
  experienceModalInstance.close();
}

function toggleFullscreenExperience() {
  experienceModalInstance.toggleFullscreen();
}

// Global ESC key handler - closes any active modal
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    ModalManager.instances.forEach(instance => {
      if (instance.modal.classList.contains('active')) {
        instance.close();
      }
    });
  }
});

// Clock Management
class ClockManager {
  constructor() {
    this.userClockEl = document.getElementById('user-clock');
    this.myClockEl = document.getElementById('my-clock');
    this.myTimezone = 'America/Sao_Paulo';
    this.formatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    
    this.start();
  }

  update() {
    const now = new Date();

    // Visitor's local time
    const userTime = new Intl.DateTimeFormat('en-US', this.formatOptions).format(now);

    // Your local time
    const myTime = new Intl.DateTimeFormat('en-US', {
      ...this.formatOptions,
      timeZone: this.myTimezone
    }).format(now);

    if (this.userClockEl) this.userClockEl.textContent = userTime;
    if (this.myClockEl) this.myClockEl.textContent = myTime;
  }

  start() {
    this.update(); // Initial call
    setInterval(() => this.update(), 1000);
  }
}

// Initialize clocks
const clockManager = new ClockManager();