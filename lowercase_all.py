import os

def lowercase_all(root):
    for dirpath, dirnames, filenames in os.walk(root, topdown=False):
        for filename in filenames:
            src = os.path.join(dirpath, filename)
            dst = os.path.join(dirpath, filename.lower())
            if src != dst:
                os.rename(src, dst)

        for dirname in dirnames:
            src = os.path.join(dirpath, dirname)
            dst = os.path.join(dirpath, dirname.lower())
            if src != dst:
                os.rename(src, dst)

lowercase_all("images")
