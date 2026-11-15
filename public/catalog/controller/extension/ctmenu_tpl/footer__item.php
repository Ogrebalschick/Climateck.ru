<?php if(!isset($item['children'])): ?>
    <?php $classes = $dropdown_classes ?: 'nav-item nav-link' ?>
    <li class="list__item"><a href="<?=$item['link'];?>" class="<?= $classes; ?> link--underline"><?=$item['title'];?></a></li>
<?php else: ?>
    <li class="footer__item">
        <div class="footer__title"><?=$item['title'];?></div>
        <ul class="footer__sublist lsit">
            <?php foreach ($item['children'] as $child): ?>
                <li class="footer__subitem">
                    <a href="<?= $child['link']; ?>" class="link--underline"><?= $child['title']; ?></a>
                </li>
            <?php endforeach; ?>
        </ul>
    </li>
<?php endif; ?>