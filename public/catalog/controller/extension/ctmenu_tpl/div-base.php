<?php if(!isset($item['children'])): ?>
    <?php $classes = $dropdown_classes ?: 'nav-item nav-link' ?>
    <li class="header__menu-item"><a href="<?=$item['link'];?>" class="<?= $classes; ?> link--underline"><?=$item['title'];?></a></li>
<?php else: ?>
    <li class="header__menu-item dropdown">
        <a href="#" class="nav-link dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><?=$item['title'];?>
            <i class="fa fa-angle-down mt-1"></i>
        </a>
        <div class="dropdown-menu">
            <?= $this->treeToHtml($item['children'], $tpl, 'dropdown-item');?>
        </div>
    </li>
<?php endif; ?>