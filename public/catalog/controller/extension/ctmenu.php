<?php

class ControllerExtensionCtmenu extends Controller
{

    public function index($data)
    {
        $lang_id = (int)$this->config->get('config_language_id');
        $menu_id = isset($data['id']) ? (int)$data['id'] : 0;
        if (isset($data['tpl'])) {
            $tpl = __DIR__ . "/ctmenu_tpl/{$data['tpl']}.php";
            if (!file_exists($tpl)) {
                $tpl = __DIR__ . "/ctmenu_tpl/list.php";
            }
        } else {
            $tpl = __DIR__ . "/ctmenu_tpl/list.php";
        }
        $this->load->model("extension/ctmenu");
        $menu_data = $this->model_extension_ctmenu->getTreeItems($menu_id);
        if (!$menu_data) {
            return null;
        }
        $ctmenu_tree = $this->model_extension_ctmenu->getMapTree($menu_data);
        $data_ctmenu = $this->model_extension_ctmenu->treeToHtml($ctmenu_tree, $tpl);

        return $data_ctmenu;
    }

    private function dump($data)
    {
        echo "<pre>" . print_r($data, 1) . "</pre>";
    }

}