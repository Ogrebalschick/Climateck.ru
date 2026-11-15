<?php if(!isset($item['children'])): ?>
    <?php $classes = $dropdown_classes ?: 'nav-item nav-link' ?>
    <li class="list__item"><a href="<?=$item['link'];?>" class="<?= $classes; ?> link--underline"><?=$item['title'];?></a></li>
<?php else: ?>
    <li class="list__item dropdown">
        <a href="#" class="nav-link dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><?=$item['title'];?>
            <i class="fa fa-angle-down mt-1"></i>
        </a>
        <ul class="list__dropdown dropdown-menu">
            <?php foreach ($item['children'] as $child): ?>
                <li class="list__dropdown-item">
                    <a href="<?= $child['link']; ?>"><?= $child['title']; ?></a>
                </li>
            <?php endforeach; ?>
        </ul>
    </li>
<?php endif; ?>