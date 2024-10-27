import pygame
from sys import exit

pygame.init()
screen = pygame.display.set_mode((800, 400))
pygame.display.set_caption("IndiaSocial: Chidiya Udd")
clock = pygame.time.Clock()

w = 800
h = 400

bg = pygame.Surface((w, h))
bg.fill((251,176,59))
prompt_box = pygame.Surface((w/4,h/10))
answer_box = pygame.Surface((w/4,h/10))

while True:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            exit()
    
    screen.blit(bg, (0, 0))
    # screen.blit(table, (300, ))
    screen.blit(prompt_box, (w/8*3, h/16))
    screen.blit(answer_box, (w/8*3, h - h/16 - h/10))
    pygame.display.update()
    clock.tick(60)