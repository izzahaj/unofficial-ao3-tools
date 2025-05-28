import os
import tkinter as tk
import zipfile
from tkinter import filedialog, messagebox

import generator


def select_html_file() -> tuple[str, str]:
    """
    Opens a file dialog for the user to select an HTML file and reads its contents.

    Returns:
        tuple[str, str]: A tuple containing the file path and the file contents as a string.
                         Returns ("", "") if no file is selected or an error occurs.
    """
    while True:
        print("Please select an HTML file.")

        file_path = filedialog.askopenfilename(
            title="Select an HTML file",
            filetypes=[("HTML files", "*.html")],
        )

        if not file_path:
            print("No file selected.")
            return "", ""

        try:
            with open(file_path, "r", encoding="utf-8") as f:
                html_content = f.read()

        except PermissionError:
            print("You do not have permission to read the selected file.")
            messagebox.showerror(
                "Permission Denied",
                f"Permission denied when trying to read {file_path}. Please try again.",
            )
            continue
        except IOError:
            print("Something went wrong when opening the file. Please try again.")
            messagebox.showerror(
                "File Error",
                "Something went wrong when opening the file. Please try again.",
            )
            continue

        return file_path, html_content


def save_generated_files(html_content: str, css_content: str, default_dir: str) -> None:
    """
    Prompts the user to select a save location and writes the HTML and CSS content to a ZIP file.

    Args:
        html_content (str): The translated HTML content to save.
        css_content (str): The corresponding CSS content to save.
        default_dir (str): The default directory to open in the file dialog.

    Returns:
        None
    """
    while True:
        original_file_name = os.path.splitext(os.path.basename(default_dir))[0]

        print("Please choose a location to save the HTML and CSS files.")

        output_path = filedialog.asksaveasfilename(
            initialdir=default_dir,
            initialfile=original_file_name,
            title="Save file As",
            defaultextension=".zip",
            filetypes=[("ZIP files", "*.zip")],
        )

        if not output_path:
            print("No save location selected.")
            return

        zip_file_name = os.path.splitext(os.path.basename(output_path))[0]
        html_file_name = f"{zip_file_name}_translated.html"
        css_file_name = f"{zip_file_name}_workskin.css"

        try:
            with zipfile.ZipFile(output_path, "w", zipfile.ZIP_DEFLATED) as zipf:
                zipf.writestr(html_file_name, html_content)
                zipf.writestr(css_file_name, css_content)

            print(f"Files saved to: {output_path}")
            return

        except PermissionError:
            print("You do not have permission to save the file.")
            messagebox.showerror(
                "Permission Denied",
                f"Permission denied when trying to save to {output_path}. Please try again.",
            )
        except (zipfile.BadZipFile, OSError):
            print("Something went wrong when saving the file. Please try again.")
            messagebox.showerror(
                "File Error",
                "Something went wrong when saving the file. Please try again.",
            )


def get_chapter_number() -> int:
    """
    Prompts the user to input a positive integer representing the chapter number.

    Keeps asking until valid input is received.

    Returns:
        int: The validated chapter number.
    """
    while True:
        user_input = input("Please enter the chapter number: ")

        try:
            chapter = int(user_input)
            if chapter <= 0:
                print("Chapter number must be a positive integer.")
                continue

            return chapter
        except ValueError:
            print("Chapter number must be a positive integer.")


def main():
    """
    Entry point for the Hover Translation tool.
    """
    print("Welcome to the Hover Translation tool!")

    root = tk.Tk()
    root.withdraw()

    html_path, html_content = select_html_file()

    if not html_path:
        print("Goodbye!")
        return

    chapter = get_chapter_number()

    print("Generating HTML and CSS files...")
    new_html_content, new_css_content = generator.generate_translations(
        html_content, chapter
    )
    print("Done!")

    save_generated_files(new_html_content, new_css_content, default_dir=html_path)

    print("Goodbye!")


if __name__ == "__main__":
    main()
