<?php
namespace Template;
final class Twig {
	private $data = array();

	public function set($key, $value) {
		$this->data[$key] = $value;
	}
	
	public function render($filename, $code = '') {
		if (!$code) {
			$file = DIR_TEMPLATE . $filename . '.twig';
	
			if (is_file($file)) {
				$code = file_get_contents($file);
			} else {
				throw new \Exception('Error: Could not load template ' . $file . '!');
			}
		}
	
		// Twig loader для файловой системы (важно!)
		$loader = new \Twig\Loader\FilesystemLoader(DIR_TEMPLATE);
	
		$config = [
			'autoescape'  => false,
			'debug'       => true,
			'auto_reload' => true,
			'cache'       => false
		];
	
		$twig = new \Twig\Environment($loader, $config);
	
		// Добавляем Debug Extension
		$twig->addExtension(new \Twig\Extension\DebugExtension());
	
		try {
			return $twig->render($filename . '.twig', $this->data);
		} catch (\Exception $e) {
			trigger_error('Twig error: ' . $e->getMessage());
			exit();
		}
	}
	
}
