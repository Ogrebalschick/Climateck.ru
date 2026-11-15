<?php if(!isset($item['children'])): ?>
    <div class="menu__item-parent"><a href="<?=$item['link'];?>" class="link--underline"><?=$item['title'];?></a></div>
<?php else: ?>
    <div class="menu__category menu__category--childs">
        <div class="menu__item-parent"><a href="<?=$item['link'];?>"><?=$item['title'];?></a></div>
        <ul class="menu__list">
            <?php foreach ($item['children'] as $child): ?>
                <li class="menu__item-child">
                    <a href="<?= $child['link']; ?>" class="link--underline"><?= $child['title']; ?></a>
                </li>
            <?php endforeach; ?>
        </ul>
    </div>
<?php endif; ?>