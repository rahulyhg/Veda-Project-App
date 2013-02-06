<?php

require_once('MVPFrame.php');

class MVPPdfContent extends MVPFrame
{
    private $phantom_js = '../vendors/PhantomJS/phantomjs';
    private $render_script = '../vendors/PhantomJS/rasterize.js';
    private $pdf_path = './pdf';
    private $pdf_url = 'pdf';
    
    private $allowed_hosts = array(
        '/^veda-app\.local$/',
        '/\.vedaproject\.org$/',
    );
    
    public function __construct()
    {
    }
    
    public function display()
    {
        $url = isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : '';
        
        $url_info = parse_url($url);
        $allowed = false;
        foreach($this->allowed_hosts as $regex)
        {
            if(preg_match($regex,$url_info['host']))
            {
                $allowed = true;
                break;
            }
        }
        if(!$allowed)
        {
            echo "URL: [$url] not allowed";
            exit;
        }
        
        // Normalize file name
        $pdf_file = preg_replace('/\W+/', '_', $url_info['query']).'.pdf';
        $full_path = $this->pdf_path . '/' . $pdf_file;
        
        
        if(file_exists($full_path))
        {
            $max_wait = 60; // Let's wait a minute
            while(!filesize($full_path) && $max_wait--)
            {
                sleep(1);
                clearstatcache(true, $full_path);
            }
        }
        else
        {
            // Create the file first to prevent process lock
            touch($full_path);
            $command = sprintf('%s %s %s %s A4', $this->phantom_js, escapeshellarg($this->render_script), escapeshellarg($url), escapeshellarg($full_path));
            echo '<span style="display:none">'.$command.'</span>';exit;
            exec($command, $output, $return);
            if ($return != 0) {
                // Error
                echo sprintf("Error running command: %s\nErrors: %s\n", $command, join("\n", $output));
                exit;
            }
        }
        
        header('Content-disposition: attachment; filename='.$pdf_file);
        header('Content-type: application/pdf');
        readfile($full_path);
    }
    
    public function getData($uri)
    {
    }
}

?>